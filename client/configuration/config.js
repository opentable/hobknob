angular.module("config", [])

.constant("ENV", {
  "RequiresAuth": false,
  "name": "development",
  "etcdHost": "127.0.0.1",
  "etcdPort": "4001",
  "hobknobHost": "localhost",
  "hobknobPort": "3006"
})

;