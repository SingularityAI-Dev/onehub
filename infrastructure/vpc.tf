# infrastructure/vpc.tf

# Create a Virtual Private Cloud (VPC) to provide an isolated network environment.
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "onehub-vpc-${var.environment}"
  }
}

# Create an Internet Gateway to allow communication between the VPC and the internet.
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "onehub-igw-${var.environment}"
  }
}

# Create a set of public subnets. These subnets are associated with the main route table,
# which will have a route to the Internet Gateway.
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = tolist(data.aws_availability_zones.available.names)[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "onehub-public-subnet-${count.index + 1}-${var.environment}"
  }
}

# Create a set of private subnets. These subnets are for resources that should not be
# directly accessible from the internet, like our backend services.
resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = tolist(data.aws_availability_zones.available.names)[count.index]

  tags = {
    Name = "onehub-private-subnet-${count.index + 1}-${var.environment}"
  }
}

# Create a route table for the public subnets with a default route to the Internet Gateway.
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "onehub-public-rt-${var.environment}"
  }
}

# Associate the public subnets with the public route table.
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Get the list of available availability zones in the current region.
# This is used to distribute the subnets across different AZs for high availability.
data "aws_availability_zones" "available" {
  state = "available"
}
