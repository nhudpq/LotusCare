# SQLite Integration for LotussCare

## What's Installed

✅ **better-sqlite3** - High-performance SQLite driver for Electron

- Fast synchronous operations
- Perfect for Electron desktop apps
- Database file stored at: `~/.config/LotussCare/lotuscare.db`

## Project Structure

```
electron/
├── src/
│   ├── config/
│   │   └── db.js                 # Database initialization
│   └── modules/
│       └── patients/
│           ├── patient.model.js        # Database queries
│           ├── patient.repository.js   # Data access layer
│           ├── patient.service.js      # Business logic
│           └── patient.routes.js       # IPC handlers
ClientApp/
└── src/
    └── hooks/
        └── usePatients.ts        # React hook for frontend
```

## Usage Example

### React Component

```tsx
import { usePatients } from "./hooks/usePatients";

function PatientList() {
  const { getAllPatients, createPatient, error, loading } = usePatients();

  const handleLoadPatients = async () => {
    try {
      const patients = await getAllPatients();
      console.log("Patients:", patients);
    } catch (err) {
      console.error("Failed to load patients:", err);
    }
  };

  const handleCreatePatient = async () => {
    try {
      const newPatient = await createPatient({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
      });
      console.log("Created:", newPatient);
    } catch (err) {
      console.error("Failed to create patient:", err);
    }
  };

  return (
    <div>
      <button onClick={handleLoadPatients} disabled={loading}>
        {loading ? "Loading..." : "Load Patients"}
      </button>
      <button onClick={handleCreatePatient}>Create Patient</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

## Available Operations

### Get All Patients

```tsx
const patients = await getAllPatients();
```

### Get Patient by ID

```tsx
const patient = await getPatientById(1);
```

### Create Patient

```tsx
const patient = await createPatient({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "123-456-7890",
  dateOfBirth: "1990-01-15",
  gender: "M",
  address: "123 Main St",
  notes: "Some notes",
});
```

### Update Patient

```tsx
const updated = await updatePatient(1, {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
});
```

### Delete Patient

```tsx
await deletePatient(1);
```

### Search Patients

```tsx
const results = await searchPatients("john");
```

## Database Schema

### Patients Table

```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  dateOfBirth TEXT,
  gender TEXT,
  address TEXT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Next Steps

1. ✅ SQLite is installed and configured
2. ✅ Database layer is set up (Model → Repository → Service)
3. ✅ IPC routes are registered in Electron main process
4. ✅ React hook created for frontend integration

To use in your components, import the `usePatients` hook and start querying!

## Important Notes

- The database file is stored in your Electron app's user data directory
- Foreign keys are enabled by default
- All timestamps are automatically managed
- The service layer includes basic validation for required fields (firstName, lastName)
