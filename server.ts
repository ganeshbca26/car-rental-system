import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_CAR_RECORDS, INITIAL_ADMIN_ACTIVITY } from "./src/data/adminMockData";
import { CarRecord, AdminActivityLog } from "./src/types";

// In-memory data store for car records and activity logs
let carsDatabase: CarRecord[] = [...INITIAL_CAR_RECORDS];
let activityLogs: AdminActivityLog[] = [...INITIAL_ADMIN_ACTIVITY];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Helper function to log activities
  function logActivity(
    action: AdminActivityLog["action"],
    title: string,
    details: string,
    car?: Partial<CarRecord>
  ) {
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      title,
      details,
      carId: car?.id,
      carName: car?.name,
      user: "Ganesh J. (Super Admin)",
      timestamp: "Just now",
    };
    activityLogs = [newLog, ...activityLogs.slice(0, 49)]; // Keep latest 50
  }

  // ==========================================
  // 1. HEALTH & METRICS ENDPOINTS
  // ==========================================
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      totalCars: carsDatabase.length,
      timestamp: new Date().toISOString(),
    });
  });

  // GET /api/stats - Dashboard analytics summary
  app.get("/api/stats", (req, res) => {
    const total = carsDatabase.length;
    const available = carsDatabase.filter((c) => c.status === "Available").length;
    const rented = carsDatabase.filter((c) => c.status === "Rented").length;
    const maintenance = carsDatabase.filter((c) => c.status === "Maintenance").length;
    const unavailable = carsDatabase.filter((c) => c.status === "Unavailable").length;

    const totalFleetValuation = carsDatabase.reduce((sum, c) => sum + (c.price || 0), 0);
    const averageRentalRate =
      total > 0
        ? Math.round(carsDatabase.reduce((sum, c) => sum + (c.rentalPricePerDay || 0), 0) / total)
        : 0;
    const utilizationRate = total > 0 ? Math.round((rented / total) * 100) : 0;

    // Category breakdown
    const categoryCount: Record<string, number> = {};
    carsDatabase.forEach((c) => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalCars: total,
        availableCars: available,
        rentedCars: rented,
        unavailableCars: unavailable,
        maintenanceCars: maintenance,
        averageRentalRate,
        totalFleetValuation,
        utilizationRate,
      },
      categoryBreakdown: categoryCount,
      recentActivity: activityLogs.slice(0, 10),
      recentlyAdded: carsDatabase.slice(0, 5),
    });
  });

  // ==========================================
  // 2. CAR CRUD API ENDPOINTS (Both /cars & /api/cars)
  // ==========================================

  // Handler for GET /cars and /api/cars
  const handleGetCars = (req: express.Request, res: express.Response) => {
    let result = [...carsDatabase];
    const { search, brand, category, status, sortBy, sortOrder } = req.query;

    // Search filter
    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.registrationNumber.toLowerCase().includes(q) ||
          c.vin.toLowerCase().includes(q) ||
          c.color.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (brand && typeof brand === "string" && brand !== "All") {
      result = result.filter((c) => c.brand.toLowerCase() === brand.toLowerCase());
    }

    // Category filter
    if (category && typeof category === "string" && category !== "All") {
      result = result.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    // Status filter
    if (status && typeof status === "string" && status !== "All") {
      result = result.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    // Sorting
    if (sortBy && typeof sortBy === "string") {
      const order = sortOrder === "desc" ? -1 : 1;
      result.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name) * order;
        if (sortBy === "price") return ((a.price || 0) - (b.price || 0)) * order;
        if (sortBy === "rentalPricePerDay") return (a.rentalPricePerDay - b.rentalPricePerDay) * order;
        if (sortBy === "year") return (a.year - b.year) * order;
        if (sortBy === "mileage") return (a.mileage - b.mileage) * order;
        if (sortBy === "createdAt") return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
        return 0;
      });
    }

    res.json({
      success: true,
      count: result.length,
      total: carsDatabase.length,
      data: result,
    });
  };

  app.get("/cars", handleGetCars);
  app.get("/api/cars", handleGetCars);

  // Handler for GET /cars/:id and /api/cars/:id
  const handleGetCarById = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const car = carsDatabase.find((c) => c.id === id);
    if (!car) {
      return res.status(404).json({ success: false, message: `Car with ID '${id}' not found.` });
    }
    res.json({ success: true, data: car });
  };

  app.get("/cars/:id", handleGetCarById);
  app.get("/api/cars/:id", handleGetCarById);

  // Handler for POST /cars and /api/cars
  const handleCreateCar = (req: express.Request, res: express.Response) => {
    const body = req.body;

    // Validation
    const requiredFields = ["name", "brand", "model", "year", "registrationNumber", "vin", "rentalPricePerDay"];
    const missing = requiredFields.filter((field) => !body[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: Missing required fields: ${missing.join(", ")}`,
        missingFields: missing,
      });
    }

    // Check duplicate registration or VIN
    const duplicate = carsDatabase.find(
      (c) =>
        c.registrationNumber.toLowerCase() === body.registrationNumber.toLowerCase() ||
        c.vin.toLowerCase() === body.vin.toLowerCase()
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `Car with registration '${body.registrationNumber}' or VIN '${body.vin}' already exists.`,
      });
    }

    const defaultImage =
      body.imageUrl ||
      (body.images && body.images.length > 0 ? body.images[0] : "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop");

    const newCar: CarRecord = {
      id: `car-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: body.name.trim(),
      brand: body.brand.trim(),
      model: body.model.trim(),
      year: Number(body.year) || new Date().getFullYear(),
      registrationNumber: body.registrationNumber.trim().toUpperCase(),
      vin: body.vin.trim().toUpperCase(),
      category: body.category || "Sedan",
      fuelType: body.fuelType || "Gas",
      transmission: body.transmission || "Automatic",
      seatingCapacity: Number(body.seatingCapacity) || 5,
      color: body.color?.trim() || "Obsidian Black",
      mileage: Number(body.mileage) || 0,
      price: Number(body.price) || 50000,
      rentalPricePerDay: Number(body.rentalPricePerDay) || 100,
      discount: Number(body.discount) || 0,
      status: body.status || "Available",
      images: body.images && body.images.length > 0 ? body.images : [defaultImage],
      imageUrl: defaultImage,
      description: body.description?.trim() || `Premium ${body.brand} ${body.model} vehicle.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: body.location?.trim() || "San Francisco International Airport (SFO)",
      luggageBags: Number(body.luggageBags) || 3,
      mpgOrRange: body.mpgOrRange || (body.fuelType === "Electric" ? "280mi Range" : "25 MPG"),
      rating: 5.0,
      reviewsCount: 0,
      specs: body.specs || {
        engine: `${body.fuelType} Engine`,
        acceleration: "0-60 mph in 5.8s",
        topSpeed: "135 mph",
        drivetrain: "All-Wheel Drive",
        climate: "Automatic Climate Control",
      },
    };

    carsDatabase.unshift(newCar);
    logActivity("create", "New Vehicle Added", `Added ${newCar.name} (${newCar.registrationNumber}) to fleet records.`, newCar);

    res.status(201).json({
      success: true,
      message: "Car added successfully.",
      data: newCar,
    });
  };

  app.post("/cars", handleCreateCar);
  app.post("/api/cars", handleCreateCar);

  // Handler for PUT /cars/:id and /api/cars/:id
  const handleUpdateCar = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const body = req.body;

    const index = carsDatabase.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Car with ID '${id}' not found.` });
    }

    const existing = carsDatabase[index];
    const updatedImages = body.images && body.images.length > 0 ? body.images : existing.images;
    const updatedImageUrl = body.imageUrl || updatedImages[0] || existing.imageUrl;

    const updatedCar: CarRecord = {
      ...existing,
      ...body,
      id: existing.id,
      year: body.year ? Number(body.year) : existing.year,
      seatingCapacity: body.seatingCapacity ? Number(body.seatingCapacity) : existing.seatingCapacity,
      mileage: body.mileage !== undefined ? Number(body.mileage) : existing.mileage,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      rentalPricePerDay: body.rentalPricePerDay ? Number(body.rentalPricePerDay) : existing.rentalPricePerDay,
      discount: body.discount !== undefined ? Number(body.discount) : existing.discount,
      images: updatedImages,
      imageUrl: updatedImageUrl,
      updatedAt: new Date().toISOString(),
    };

    carsDatabase[index] = updatedCar;
    logActivity(
      existing.status !== updatedCar.status ? "status_change" : "update",
      `Vehicle Record Updated`,
      `Updated ${updatedCar.name} (Status: ${updatedCar.status}, Rate: $${updatedCar.rentalPricePerDay}/day).`,
      updatedCar
    );

    res.json({
      success: true,
      message: "Car updated successfully.",
      data: updatedCar,
    });
  };

  app.put("/cars/:id", handleUpdateCar);
  app.put("/api/cars/:id", handleUpdateCar);

  // Handler for DELETE /cars/:id and /api/cars/:id
  const handleDeleteCar = (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const index = carsDatabase.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Car with ID '${id}' not found.` });
    }

    const deleted = carsDatabase.splice(index, 1)[0];
    logActivity("delete", "Vehicle Deleted", `Permanently removed ${deleted.name} (${deleted.registrationNumber}) from fleet records.`, deleted);

    res.json({
      success: true,
      message: `Car '${deleted.name}' was successfully deleted.`,
      deletedId: id,
    });
  };

  app.delete("/cars/:id", handleDeleteCar);
  app.delete("/api/cars/:id", handleDeleteCar);

  // Reset database endpoint for demo
  app.post("/api/cars/reset", (req, res) => {
    carsDatabase = [...INITIAL_CAR_RECORDS];
    activityLogs = [...INITIAL_ADMIN_ACTIVITY];
    res.json({ success: true, message: "Database reset to initial fleet records.", count: carsDatabase.length });
  });

  // ==========================================
  // 3. VITE MIDDLEWARE & STATIC ASSET SERVING
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Car Management Admin & Rental Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
