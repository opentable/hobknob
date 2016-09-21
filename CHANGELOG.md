# 3.0
 - Added:
   - A new required option `dataSource` in the config - to support multiple backends
   - A new required option `loadBalancerFile` in the config - which is a path to the Load Balancer file.
 - Changed:
   - Refactored the etcD support - so it's possible to support additional backends
   - Add a failure flash when Azure gives you Auth problems to match the Google Auth experience

---
