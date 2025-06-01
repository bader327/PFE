-- CreateCollection
CREATE COLLECTION "HourlyData" (
  id String @id @default(auto()) @map("_id") @db.ObjectId,
  fileId String @db.ObjectId,
  hour Int,
  produitsConformes Int,
  produitsNonConformes Int,
  total Int,
  file File @relation(fields: [fileId], references: [id])
);
