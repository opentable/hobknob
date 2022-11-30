# 3.0
 - Added:
   - A new required option `dataSource` in the config - to support multiple backends
   - A new required option `loadBalancerFile` in the config - which is a path to the Load Balancer file.
   - Additional backends are now supported - made possible by refactoring & wrapping the etcD support
 - Changed:
   - Add a failure flash when Azure gives you Auth problems to match the Google Auth experience

---
