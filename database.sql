
-- Database Schema for Pizzeria Pro
-- Designed for PostgreSQL

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_extras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE users_admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    restaurant_name VARCHAR(255) NOT NULL DEFAULT 'La Mejor Pizza',
    whatsapp_number VARCHAR(20) NOT NULL DEFAULT '5491122334455',
    address TEXT,
    theme_color VARCHAR(20) DEFAULT '#ef4444',
    opening_hours TEXT,
    currency VARCHAR(10) DEFAULT '$',
    CONSTRAINT one_row CHECK (id = 1)
);

CREATE TABLE orders_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255),
    order_text TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data
INSERT INTO categories (name, icon) VALUES ('Pizzas', '🍕'), ('Bebidas', '🥤'), ('Combos', '🔥');

INSERT INTO settings (restaurant_name, whatsapp_number, address, opening_hours) 
VALUES ('Pizzeria Italia', '5491100000000', 'Av. Siempre Viva 123', 'Mar-Dom 19:00 a 23:30');
