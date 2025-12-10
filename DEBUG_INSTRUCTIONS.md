// Add this at the top of the file after imports
const DEBUG_ACCESS = true; // Set to false in production

// Then in the checkAccess function, add logging:
useEffect(() => {
  const checkAccess = async () => {
    if (authLoading || unitLoading || roleLoading || permissionLoading) {
      return;
    }

    try {
      if (!user) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.push("/auth/login");
        return;
      }

      // Debug logging
      if (DEBUG_ACCESS) {
        console.log("==== ACCESS CONTROL DEBUG ====");
        console.log("URL Path:", pathname);
        console.log("Role from path:", roleFromPath);
        console.log("Business Unit from path:", businessUnitFromPath);
        console.log("User object:", user);
        console.log("User businessUnits:", userBusinessUnits);
        console.log("Current role:", currentRole);
      }

      // 2. Verify token validity
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.push("/auth/login");
        return;
      }

      // 3. Check if user has access to this business unit
      const isSuperAdmin =
        (user?.roles && Array.isArray(user.roles) && user.roles.some((r: any) =>
          (r.name && r.name.toLowerCase() === 'super-admin') ||
          (r.id && r.id === 'super-admin')
        )) ||
        (user && (user as any).role && Array.isArray((user as any).role) && (user as any).role.some((r: string) => r.toLowerCase() === 'super-admin'));

      if (DEBUG_ACCESS) {
        console.log("Is Super Admin:", isSuperAdmin);
      }

      const hasAccessToUnit = userBusinessUnits?.some((u: any) => {
        const match = u.id === businessUnitFromPath ||
          (u.slug && u.slug === businessUnitFromPath) ||
          (u.name && u.name.toLowerCase().replace(/ /g, '-') === businessUnitFromPath) ||
          (u._id && u._id.toString() === businessUnitFromPath);
        
        if (DEBUG_ACCESS) {
          console.log(`Checking BU: ${u.name || u.id}`, {
            'u.id': u.id,
            'u.slug': u.slug,
            'u._id': u._id,
            'businessUnitFromPath': businessUnitFromPath,
            'match': match
          });
        }
        
        return match;
      });

      if (DEBUG_ACCESS) {
        console.log("Has access to unit:", hasAccessToUnit);
      }

      if (
        businessUnitFromPath &&
        !isSuperAdmin &&
        !hasAccessToUnit
      ) {
        console.warn('Access Denied: Unit mismatch', { businessUnitFromPath, isSuperAdmin, hasAccessToUnit });
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Rest of the access checks...
      setIsAuthorized(true);
      setIsChecking(false);
    } catch (error) {
      console.error("Access check error:", error);
      setIsAuthorized(false);
      setIsChecking(false);
    }
  };

  checkAccess();
}, [user, pathname, authLoading, unitLoading, roleLoading, permissionLoading]);
