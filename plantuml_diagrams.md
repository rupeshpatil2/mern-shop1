# PlantUML Diagrams for draw.io

You can copy and paste the following blocks directly into Draw.io's "Insert -> Advanced -> PlantUML" feature, or use them in any PlantUML viewer.

## 4. ER Diagram
```plantuml
@startuml
hide circle
skinparam linetype ortho

entity "User" as user {
  * _id : ObjectId <<PK>>
  --
  * name : String
  * email : String
  * password : String
  isVerified : Boolean
  isAdmin : Boolean
}

entity "Address" as address {
  * _id : ObjectId <<PK>>
  --
  * user : ObjectId <<FK>>
  street : String
  * city : String
  * state : String
  * phoneNumber : String
  * postalCode : String
  * country : String
  * type : String
}

entity "Product" as product {
  * _id : ObjectId <<PK>>
  --
  * title : String
  * description : String
  * price : Number
  discountPercentage : Number
  * category : ObjectId <<FK>>
  * brand : ObjectId <<FK>>
  * stockQuantity : Number
  * thumbnail : String
  * images : String[]
  isDeleted : Boolean
}

entity "Order" as order {
  * _id : ObjectId <<PK>>
  --
  * user : ObjectId <<FK>>
  * item : Mixed[]
  * address : Mixed[]
  status : String
  * paymentMode : String
  * total : Number
  createdAt : Date
}

entity "Cart" as cart {
  * _id : ObjectId <<PK>>
  --
  * user : ObjectId <<FK>>
  * product : ObjectId <<FK>>
  quantity : Number
}

entity "Category" as category {
  * _id : ObjectId <<PK>>
  --
  * name : String
}

entity "Brand" as brand {
  * _id : ObjectId <<PK>>
  --
  * name : String
}

entity "Wishlist" as wishlist {
  * _id : ObjectId <<PK>>
  --
  * user : ObjectId <<FK>>
  * product : ObjectId <<FK>>
  note : String
  createdAt : Date
}

user ||--o{ address
user ||--o{ order
user ||--o{ cart
user ||--o{ wishlist

product }o--|| category
product }o--|| brand
product ||--o{ cart
product ||--o{ wishlist
@enduml
```

## 5.1 Class Diagram
```plantuml
@startuml
class User {
  +String name
  +String email
  +String password
  +Boolean isVerified
  +Boolean isAdmin
}

class Address {
  +ObjectId user
  +String street
  +String city
  +String state
  +String phoneNumber
  +String postalCode
  +String country
  +String type
}

class Product {
  +String title
  +String description
  +Number price
  +Number discountPercentage
  +ObjectId category
  +ObjectId brand
  +Number stockQuantity
  +String thumbnail
  +String[] images
  +Boolean isDeleted
}

class Order {
  +ObjectId user
  +Mixed[] item
  +Mixed[] address
  +String status
  +String paymentMode
  +Number total
  +Date createdAt
}

class Cart {
  +ObjectId user
  +ObjectId product
  +Number quantity
}

class Category {
  +String name
}

class Brand {
  +String name
}

class Wishlist {
  +ObjectId user
  +ObjectId product
  +String note
  +Date createdAt
}

User "1" -- "*" Address : has
User "1" -- "*" Order : places
User "1" -- "*" Cart : has
User "1" -- "*" Wishlist : creates

Product "*" -- "1" Category : belongs to
Product "*" -- "1" Brand : belongs to
Cart "*" -- "1" Product : involves
Wishlist "*" -- "1" Product : involves
@enduml
```

## 5.2 Use Case Diagram
```plantuml
@startuml
left to right direction
actor "Customer" as c
actor "Admin" as a

package "E-Commerce System" {
  usecase "Register / Login" as UC1
  usecase "Browse & Search Products" as UC2
  usecase "Manage Cart" as UC3
  usecase "Manage Wishlist" as UC4
  usecase "Place Order" as UC5
  usecase "Manage Addresses" as UC7
  usecase "Manage Products Backend" as UC8
}

c --> UC1
c --> UC2
c --> UC3
c --> UC4
c --> UC5
c --> UC7

a --> UC1
a --> UC8
a --> UC2

a -|> c
@enduml
```

## 5.3 Activity Diagram
```plantuml
@startuml
start
if (Is user logged in?) then (No)
  :Login / Register;
else (Yes)
endif
:Browse Products;
:Add Product to Cart;
:Access Cart Context;
:Go to Checkout;
:Select or Add Shipping Address;
repeat
  :Select Payment Mode (COD, UPI, CARD);
  backward:Show Error & Retry Payment;
repeat while (Is Payment Successful?) is (No) not (Yes)
:Order Placed\nStatus: Pending;
stop
@enduml
```

## 5.4 Component Diagram
```plantuml
@startuml
node "Client Application" {
  [React App] as Client
}

node "Backend Application" {
  [Express Backend] as Server
}

database "MongoDB Atlas" {
  [MongoDB] as DB
}

Client <--> Server : REST API
Server <--> DB : Mongoose queries
@enduml
```

## 5.5 Package Diagram
```plantuml
@startuml
package "Frontend" {
  [src/pages] as F1
  [src/components] as F2
  [src/features (Redux)] as F3
}

package "Backend" {
  [routes] as B1
  [controllers] as B2
  [models] as B3
  [utils] as B4
}

F1 --> F2
F2 --> F3
F3 ==> B1 : API calls (JSON)
B1 --> B2
B2 --> B3
B2 ..> B4
@enduml
```

## 5.6 Deployment Diagram
```plantuml
@startuml
node "Client Device (Browser/Mobile)" as node1
node "Web Hosting Server (Vercel/Netlify)" as node2
node "Node.js Application Server (Render/Heroku)" as node3
database "Database Server (MongoDB Atlas Cloud Cluster)" as node4

node1 -- node2 : HTTPS GET (Static Bundle)
node1 -- node3 : API Requests (HTTPS REST)
node3 -- node4 : Mongoose Connection (TCP/IP)
@enduml
```

## 7.1 DFD Level 0 (Context Diagram)
```plantuml
@startuml
!define ENTITY rectangle
!define PROCESS usecase
!define DATASTORE database

ENTITY Customer as C
ENTITY Admin as A
PROCESS "E-Commerce System" as SYS
DATASTORE "Central Database" as DB

C --> SYS : Auth Info / Orders
SYS --> C : Products / Status
A --> SYS : Product Management
SYS --> A : Stats & Dashboard
SYS <--> DB : Read / Write Data
@enduml
```

## 7.2 DFD Level 1
```plantuml
@startuml
!define ENTITY rectangle
!define PROCESS usecase
!define DATASTORE database

ENTITY Customer as C
ENTITY Admin as A

PROCESS "1.0 User & Auth" as P1
PROCESS "2.0 Products & Cat" as P2
PROCESS "3.0 Orders & Cart" as P3

DATASTORE "D1 Users Data" as D1
DATASTORE "D2 Products Data" as D2
DATASTORE "D3 Orders Data" as D3

C --> P1 : Credentials
P1 --> D1

A --> P2 : Product Data
P2 --> D2

P2 --> C : Product List

C --> P3 : Cart Details / Payment
P3 --> D3
P3 --> C : Order Status
@enduml
```
