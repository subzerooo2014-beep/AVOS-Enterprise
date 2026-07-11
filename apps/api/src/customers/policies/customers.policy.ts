export class CustomersPolicy {
  static canRead(user?: any) {
    return !!user;
  }

  static canCreate(user?: any) {
    return !!user;
  }

  static canWrite(user?: any) {
    return !!user;
  }

  static canDelete(user?: any) {
    return !!user && user.role === "ADMIN";
  }

  static canRestore(user?: any) {
    return !!user && user.role === "ADMIN";
  }

  static canExport(user?: any) {
    return !!user;
  }

  static canImport(user?: any) {
    return !!user && ["ADMIN", "MANAGER"].includes(user.role);
  }
}
