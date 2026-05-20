# Project Architecture & Documentation

## 4. ER Diagram
The Entity-Relationship diagram outlines the main entities in the database and their relations based on your Mongoose models.

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String email
        String password
        Boolean isVerified
        Boolean isAdmin
    }
    ADDRESS {
        ObjectId _id PK
        ObjectId user FK
        String street
        String city
        String state
        String phoneNumber
        String postalCode
        String country
        String type
    }
    PRODUCT {
        ObjectId _id PK
        String title
        String description
        Number price
        Number discountPercentage
        ObjectId category FK
        ObjectId brand FK
        Number stockQuantity
        String thumbnail
        String[] images
        Boolean isDeleted
    }
    ORDER {
        ObjectId _id PK
        ObjectId user FK
        Mixed[] item
        Mixed[] address
        String status
        String paymentMode
        Number total
        Date createdAt
    }
    CART {
        ObjectId _id PK
        ObjectId user FK
        ObjectId product FK
        Number quantity
    }
    CATEGORY {
        ObjectId _id PK
        String name
    }
    BRAND {
        ObjectId _id PK
        String name
    }
    WISHLIST {
        ObjectId _id PK
        ObjectId user FK
        ObjectId product FK
        String note
        Date createdAt
    }

    USER ||--o{ ADDRESS : "has many"
    USER ||--o{ ORDER : "places"
    USER ||--o{ CART : "owns"
    USER ||--o{ WISHLIST : "maintains"
    PRODUCT }o--|| CATEGORY : "belongs to"
    PRODUCT }o--|| BRAND : "belongs to"
    PRODUCT ||--o{ CART : "is contained in"
    PRODUCT ||--o{ WISHLIST : "is in"
```

## 5. UML Diagrams

### 5.1 Class Diagram
Displays the structure of the system's classes, their attributes, and operations.

```mermaid
classDiagram
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
```

### 5.2 Use Case Diagram
Visualizes the interactions between the system and its users (actors).

```mermaid
flowchart LR
    Customer((Customer))
    Admin((Admin))

    subgraph E-Commerce System
        UC1([Register / Login])
        UC2([Browse & Search Products])
        UC3([Manage Cart])
        UC4([Manage Wishlist])
        UC5([Place Order])
        UC7([Manage Addresses])
        UC8([Manage Products Backend])
        UC9([Manage Categories & Brands])
        UC10([Manage All Orders])
        UC11([Manage Users])
    end

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC7

    Admin --> UC1
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin -.->|Inherits| Customer
```

### 5.3 Activity Diagram
Describes the flow of the primary activity: Placing an Order.

```mermaid
flowchart TD
    A([Start]) --> B{Is user logged in?}
    B -- No --> C[Login / Register]
    C --> D
    B -- Yes --> D[Browse Products]
    D --> E[Add Product to Cart]
    E --> F[Access Cart Context]
    F --> G[Go to Checkout]
    G --> H[Select or Add\nShipping Address]
    H --> I[Select Payment Mode\nCOD, UPI, CARD]
    I --> J{Is Payment\nSuccessful?}
    J -- No --> K[Show Error & \nRetry Payment]
    K --> I
    J -- Yes --> L[Order Placed\nStatus: Pending]
    L --> M([End Flow])
```

### 5.4 Component Diagram
Shows how the system components are wired together.

```mermaid
flowchart TD
    Client[React App] <-->|REST API| Server[Express Backend]
    Server <-->|Mongoose queries| DB[(MongoDB)]
```

### 5.5 Package Diagram
Illustrates the structural divisions (packages) of the MERN codebase.

```mermaid
flowchart TD
    subgraph Frontend["📦 Frontend Package"]
        F1["📁 src/pages"]
        F2["📁 src/components"]
        F3["📁 src/features (Redux)"]
    end

    subgraph Backend["📦 Backend Package"]
        B1["📁 routes"]
        B2["📁 controllers"]
        B3["📁 models"]
        B4["📁 utils"]
    end

    F1 --> F2
    F2 --> F3
    F3 == "API calls (JSON)" ===> B1
    B1 --> B2
    B2 --> B3
    B2 -.-> B4
```

### 5.6 Deployment Diagram
Depicts the physical execution environment of the components.

```mermaid
flowchart TD
    node1["💻 Client Device (Browser/Mobile)"]
    node2["☁️ Web Hosting Server (e.g., Vercel/Netlify)"]
    node3["⚙️ Node.js Application Server (e.g., Render/Heroku)"]
    node4["🗄️ Database Server (MongoDB Atlas Cloud Cluster)"]

    node1 -- "HTTPS GET (Static Bundle)" --> node2
    node1 -- "API Requests (HTTPS REST)" --> node3
    node3 -- "Mongoose Connection (TCP/IP)" --> node4
```

---

## 6. Data Dictionary
The Data Dictionary provides a detailed breakdown of each field in all major collections within the database.

### `users` Collection (User.js)
| Field Name | Data Type | Required/Unique | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for the user |
| `name` | String | Required | Full name of the user |
| `email` | String | Required, Unique | Email address used for authentication |
| `password` | String | Required | Encrypted/hashed password |
| `isVerified` | Boolean | Default: `false` | True if email authentication (OTP) is verified |
| `isAdmin` | Boolean | Default: `false` | True for administrative privileges |

### `addresses` Collection (Address.js)
| Field Name | Data Type | Required/Unique | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for the address |
| `user` | ObjectId | Ref: User | The associated user who owns this address |
| `street` | String | Optional | Street name/number |
| `city` | String | Required | Name of the city |
| `state` | String | Required | State or province |
| `phoneNumber`| String | Required | Contact phone number |
| `postalCode` | String | Required | Zip code or postal code |
| `country` | String | Required | Country name |
| `type` | String | Required | Type of address (e.g., Home, Work) |

### `products` Collection (Product.js)
| Field Name | Data Type | Required/Unique | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for a product |
| `title` | String | Required | The name / title of the product |
| `description` | String | Required | Detailed description of the product |
| `price` | Number | Required | Standard unit price |
| `discountPercentage`| Number| Default: 0 | Discount applied to the product price |
| `category` | ObjectId | Ref: Category | Foreign key linking to the associated category |
| `brand` | ObjectId | Ref: Brand | Foreign key linking to the associated brand |
| `stockQuantity`| Number | Required | Total items available in inventory |
| `thumbnail` | String | Required | URL to the primary image/thumbnail |
| `images` | [String] | Required | Array of URLs to secondary images |
| `isDeleted` | Boolean | Default: false | Soft deletion flag |

### `orders` Collection (Order.js)
| Field Name | Data Type | Required/Unique | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for an order |
| `user` | ObjectId | Ref: User | User who placed the order |
| `item` | [Mixed] | Required | Array containing the product objects/cart snapshots |
| `address` | [Mixed] | Required | Snapshot array of the delivery address selected |
| `status` | String | Default: 'Pending' | Current status: Pending, Dispatched, Out for delivery, Cancelled |
| `paymentMode` | String | Required, Enum | Expected to be 'COD', 'UPI', or 'CARD' |
| `total` | Number | Required | Total computed cost for the order |
| `createdAt` | Date | Default: Date.now()| Auto-generated timestamp for order placement |

### `carts` Collection (Cart.js)
| Field Name | Data Type | Required/Unique | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for a cart item line |
| `user` | ObjectId | Ref: User | Associated user |
| `product` | ObjectId | Ref: Product | The specific product added to the cart |
| `quantity` | Number | Default: 1 | Quantity of that product set by the user |

### `categories` & `brands` Collections
| Field Name | Data Type | Required/Unique | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier |
| `name` | String | Required | Identifying name (e.g., 'Electronics', 'Apple') |

### `wishlists` Collection (Wishlist.js)
| Field Name | Data Type | Required/Unique | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier |
| `user` | ObjectId | Ref: User | Associated user |
| `product` | ObjectId | Ref: Product | The product bookmarked |
| `note` | String | Optional | Optional personal note attached by the user |

---

## 7. Data Flow Diagrams (DFD)

### 7.1 DFD Level 0 (Context Diagram)
Shows the system boundaries and its interactions with external entities.

```mermaid
flowchart LR
    C[Customer]
    A[Admin]
    Sys((E-Commerce\nSystem))
    DB[(Database)]

    C -- "Auth Info / Orders" --> Sys
    Sys -- "Products / Status" --> C

    A -- "Product Management" --> Sys
    Sys -- "Stats & Dashboard" --> A

    Sys <-->|"Read/Write Data"| DB
```

### 7.2 DFD Level 1
Breaks down the main system into high-level sub-processes and data stores.

```mermaid
flowchart TB
    C[Customer]
    A[Admin]

    P1((1.0 User & Auth))
    P2((2.0 Products & Cat))
    P3((3.0 Orders & Cart))

    D1[(D1 Users Data)]
    D2[(D2 Products Data)]
    D3[(D3 Orders Data)]

    C --> |Credentials| P1
    P1 --> D1

    A --> |Product Data| P2
    P2 --> D2
    P2 --> |Product List| C

    C --> |Cart Details / Payment| P3
    P3 --> D3
    P3 --> |Order Status| C
```
