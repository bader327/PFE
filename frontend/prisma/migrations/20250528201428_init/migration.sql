-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('MANAGER', 'OPERATEUR', 'CADRE');

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    
    "content" TEXT NOT NULL,
    "ligneId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ligneId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'OPERATEUR',
    "ligneId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ligne" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Ligne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "ligneId" INTEGER,
    "produitsConformes" INTEGER NOT NULL,
    "produitsNonConformes" INTEGER NOT NULL,
    "bobinesIncompletes" INTEGER NOT NULL,
    "ftq" DOUBLE PRECISION NOT NULL,
    "tauxProduction" DOUBLE PRECISION NOT NULL,
    "tauxRejets" DOUBLE PRECISION NOT NULL,
    "productionCible" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fps1" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "operateur" TEXT NOT NULL,
    "defaut" TEXT NOT NULL,
    "produit" TEXT NOT NULL,
    "numeroBobine" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "enregistrer" BOOLEAN NOT NULL DEFAULT false,
    "fpsNiveau1" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Fps1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fps2" (
    "id" SERIAL NOT NULL,
    "fps1Id" INTEGER NOT NULL,
    "chefEquipeProd" TEXT NOT NULL,
    "chefEquipeQualite" TEXT NOT NULL,
    "probleme" TEXT NOT NULL,
    "numeroBobine" TEXT NOT NULL,
    "causeApparente" TEXT NOT NULL,
    "cause1" TEXT NOT NULL,
    "cause2" TEXT NOT NULL,
    "cause3" TEXT NOT NULL,
    "cause4" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "enregistrer" BOOLEAN NOT NULL DEFAULT false,
    "passerNiveau2" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Fps2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fps3" (
    "id" SERIAL NOT NULL,
    "fps2Id" INTEGER NOT NULL,
    "handeled" BOOLEAN NOT NULL DEFAULT false,
    "d1Equipe" TEXT NOT NULL,
    "d2Probleme" TEXT NOT NULL,
    "d3ActionsImmediates" TEXT NOT NULL,
    "d4AnalyseCauses" TEXT NOT NULL,
    "cinqPourquoi" TEXT NOT NULL,
    "ishikawaDiagram" TEXT NOT NULL,
    "d5ActionsCorrectives" TEXT NOT NULL,
    "d6ValidationEfficacite" TEXT NOT NULL,
    "d7ActionsPreventives" TEXT NOT NULL,
    "d8ClotureRapport" TEXT NOT NULL,
    "dateCloture" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfPath" TEXT,

    CONSTRAINT "Fps3_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Fps1_fileId_key" ON "Fps1"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Fps2_fps1Id_key" ON "Fps2"("fps1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Fps3_fps2Id_key" ON "Fps3"("fps2Id");

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_ligneId_fkey" FOREIGN KEY ("ligneId") REFERENCES "Ligne"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ligneId_fkey" FOREIGN KEY ("ligneId") REFERENCES "Ligne"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ligneId_fkey" FOREIGN KEY ("ligneId") REFERENCES "Ligne"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ligneId_fkey" FOREIGN KEY ("ligneId") REFERENCES "Ligne"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fps1" ADD CONSTRAINT "Fps1_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fps2" ADD CONSTRAINT "Fps2_fps1Id_fkey" FOREIGN KEY ("fps1Id") REFERENCES "Fps1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fps3" ADD CONSTRAINT "Fps3_fps2Id_fkey" FOREIGN KEY ("fps2Id") REFERENCES "Fps2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
