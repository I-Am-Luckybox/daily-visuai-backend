output "bucket_id" {
    description = "Name of the S3 bucket that holds the TF state"
    value = try(aws_s3_bucket.bootstrap_bucket.id)
}

output "bucket_region" {
    description = "Region where the S3 bucket resides"
    value = try(aws_s3_bucket.bootstrap_bucket.bucket_region)
}

output "cockroachdb_cluster_id" {
    description = "ID of the general CockroachDB cluster"
    value = try(cockroach_cluster.cockroach_cluster.id)
}
