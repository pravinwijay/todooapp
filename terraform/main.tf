terraform {
  required_version = ">= 1.2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# =================================================================
# 🛡️ SECURITY GROUP (PARE-FEU AWS)
# =================================================================
resource "aws_security_group" "todo_sg" {
  name        = "todo-app-security-group"
  description = "Autoriser le trafic vers la Todo App et la suite de monitoring"

  # Port 22 : SSH (indispensable pour l'administration et Ansible)
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Idéalement, restreindre à votre adresse IP publique
  }

  # Port 80 : Nginx HTTP
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 443 : Nginx HTTPS
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 9090 : Prometheus (Exposé temporairement pour le jury)
  ingress {
    description = "Prometheus"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Port 3001 : Grafana (Exposé temporairement pour le jury)
  ingress {
    description = "Grafana"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Flux sortant complet (Autorise le serveur à aller sur Internet)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "todo-app-sg"
  }
}

# =================================================================
# 💻 SERVEUR VPS (INSTANCE AWS EC2)
# =================================================================
resource "aws_instance" "todo_server" {
  # AMI pour Ubuntu 22.04 LTS (valide pour la région eu-west-3 Paris)
  ami           = "ami-00c71bd4d220aa22a" 
  instance_type = var.instance_type
  key_name      = var.key_name

  # Liaison du groupe de sécurité
  vpc_security_group_ids = [aws_security_group.todo_sg.id]

  # Dimensionnement disque dur
  root_block_device {
    volume_size           = 20 # 20 Go (parfait pour Docker et stocker les métriques)
    volume_type           = "gp3"
    delete_on_termination = true
  }

  tags = {
    Name = "todo-app-production-server"
    Role = "DevOps-Demonstration"
  }
}
