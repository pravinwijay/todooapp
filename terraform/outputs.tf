output "public_ip" {
  description = "L'adresse IP publique du serveur de production"
  value       = aws_instance.todo_server.public_ip
}

output "ssh_command" {
  description = "Commande SSH rapide pour se connecter au serveur de production"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_instance.todo_server.public_ip}"
}
