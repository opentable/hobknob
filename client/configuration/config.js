angular.module("config", [])

.constant("ENV", {
  "RequiresAuth": false,
  "etcdHost": "127.0.0.1",
  "etcdPort": "4001",
  "hobknobHost": "localhost",
  "hobknobPort": "3006",
  "categories": [
    {
      "name": "Simple Features"
    },
    {
      "name": "Domain Features",
      "id": 1,
      "values": [
        "com",
        "couk",
        "de",
        "fr"
      ]
    },
    {
      "name": "Locale Features",
      "id": 2,
      "values": [
        "en-GB",
        "en-US",
        "fr-FR",
        "de-DE"
      ]
    }
  ]
})

;