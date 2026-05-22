variable "aws_region" {
  description = "Région AWS où déployer l'infrastructure"
  type        = string
  default     = "eu-west-3" # Paris (idéal pour la latence en France)
}

variable "instance_type" {
  description = "Type d'instance EC2 pour notre serveur"
  type        = string
  default     = "t2.micro" # Éligible à l'offre gratuite AWS (Free Tier)
}

variable "key_name" {
  description = "Nom de la paire de clés SSH sur AWS pour se connecter au VPS"
  type        = string
  default     = "todo-app-key"
}
