from fastapi import FastAPI
from .database import Base, engine
from .routes import auth, employees

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Management System API", version="1.0.0")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(employees.router, prefix="/employees", tags=["Employees"])

@app.get("/doc", include_in_schema=False)
def swagger_alias():
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/docs")

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "service": "employee-backend", "version": "1.0.0"}

@app.get("/", tags=["Health"])
def root():
    return {"message": "Employee Management System API is running"}
