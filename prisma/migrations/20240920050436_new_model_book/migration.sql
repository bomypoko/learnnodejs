-- CreateTable
CREATE TABLE "book" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);
