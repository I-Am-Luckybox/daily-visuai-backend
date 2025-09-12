output "bucket_id" {
    description = "Name of the S3 bucket that holds the TF state"
    value = try(aws_s3_bucket.this.id)
}

output "bucket_region" {
    description = "Region where the S3 bucket resides"
    value = try(aws_s3_bucket.this.bucket_region)
}
