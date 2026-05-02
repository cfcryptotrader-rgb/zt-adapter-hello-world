variable "aws_region" {
  description = "AWS region for the public authorization gateway example."
  type        = string
  default     = "us-east-2"
}

variable "project" {
  description = "Name prefix for example resources."
  type        = string
  default     = "zt-adapter-hello-world"
}

variable "log_retention_days" {
  description = "CloudWatch log retention for the gateway Lambda."
  type        = number
  default     = 14
}

