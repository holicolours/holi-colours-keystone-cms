-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "email" TEXT NOT NULL DEFAULT E'',
    "password" TEXT,
    "role" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetIssuedAt" TIMESTAMP(3),
    "passwordResetRedeemedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "slug" TEXT NOT NULL DEFAULT E'',
    "featureInHomePage" BOOLEAN NOT NULL DEFAULT false,
    "additionalInformation" JSONB NOT NULL DEFAULT E'[{"type":"paragraph","children":[{"text":""}]}]',
    "creationDate" TIMESTAMP(3),
    "lastUpdatedDate" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "image" JSONB,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "hexColor" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedLink" (
    "id" TEXT NOT NULL,
    "embedLink" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "EmbedLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "slug" TEXT NOT NULL DEFAULT E'',
    "status" TEXT DEFAULT E'DRAFT',
    "sku" INTEGER,
    "description" TEXT NOT NULL DEFAULT E'',
    "additionalInformation" JSONB NOT NULL DEFAULT E'[{"type":"paragraph","children":[{"text":""}]}]',
    "creationDate" TIMESTAMP(3),
    "lastUpdatedDate" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOption" (
    "id" TEXT NOT NULL,
    "product" TEXT,
    "optionName" TEXT,

    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOptionName" (
    "id" TEXT NOT NULL,
    "optionName" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "ProductOptionName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOptionValue" (
    "id" TEXT NOT NULL,
    "optionValue" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "ProductOptionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "product" TEXT,
    "status" TEXT DEFAULT E'DRAFT',
    "description" TEXT NOT NULL DEFAULT E'',
    "image" JSONB,
    "regularPrice" INTEGER NOT NULL,
    "salePrice" INTEGER,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION NOT NULL,
    "packageLength" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "packageWidth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "packageHeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sku" TEXT,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "image" JSONB,
    "altText" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accessory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "status" TEXT DEFAULT E'DRAFT',
    "price" INTEGER NOT NULL,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL DEFAULT E'',
    "product" TEXT,
    "status" TEXT DEFAULT E'OS',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "inventoryLocation" TEXT NOT NULL DEFAULT E'',
    "vendor" TEXT,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundStock" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "stockQuantity" INTEGER NOT NULL,
    "dateOfPurchase" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InboundStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundStock" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "stockQuantity" INTEGER NOT NULL,
    "order" TEXT,

    CONSTRAINT "OutboundStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "mobileNumber" TEXT NOT NULL DEFAULT E'',
    "address" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "product" TEXT,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL DEFAULT E'',
    "orderDate" TIMESTAMP(3),
    "status" TEXT DEFAULT E'PP',
    "subTotal" INTEGER,
    "shippingMethod" TEXT NOT NULL DEFAULT E'',
    "shippingCharge" INTEGER,
    "discount" INTEGER,
    "total" INTEGER,
    "customer" TEXT,
    "customerFirstName" TEXT NOT NULL DEFAULT E'',
    "customerLastName" TEXT NOT NULL DEFAULT E'',
    "customerEmail" TEXT NOT NULL DEFAULT E'',
    "customerPhoneNumber" TEXT NOT NULL DEFAULT E'',
    "customerAlternatePhoneNumber" TEXT NOT NULL DEFAULT E'',
    "shipToAddress1" TEXT NOT NULL DEFAULT E'',
    "shipToAddress2" TEXT NOT NULL DEFAULT E'',
    "shipToCity" TEXT NOT NULL DEFAULT E'',
    "shipToState" TEXT NOT NULL DEFAULT E'',
    "shipToCountry" TEXT NOT NULL DEFAULT E'',
    "shipToPostalCode" TEXT NOT NULL DEFAULT E'',
    "cartJSON" JSONB,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order" TEXT,
    "item" TEXT NOT NULL DEFAULT E'',
    "image" JSONB,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderNote" (
    "id" TEXT NOT NULL,
    "order" TEXT,
    "note" TEXT NOT NULL DEFAULT E'',
    "date" TIMESTAMP(3),

    CONSTRAINT "OrderNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL DEFAULT E'',
    "firstName" TEXT NOT NULL DEFAULT E'',
    "lastName" TEXT NOT NULL DEFAULT E'',
    "email" TEXT NOT NULL DEFAULT E'',
    "status" TEXT DEFAULT E'G',
    "phoneNumber" TEXT NOT NULL DEFAULT E'',
    "alternatePhoneNumber" TEXT NOT NULL DEFAULT E'',
    "shipToAddress1" TEXT NOT NULL DEFAULT E'',
    "shipToAddress2" TEXT NOT NULL DEFAULT E'',
    "shipToCity" TEXT NOT NULL DEFAULT E'',
    "shipToState" TEXT NOT NULL DEFAULT E'',
    "shipToCountry" TEXT NOT NULL DEFAULT E'',
    "shipToPostalCode" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL DEFAULT E'',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "discountCondition" TEXT,
    "discountAction" TEXT,
    "offerText" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCondition" (
    "id" TEXT NOT NULL,
    "minimumItemsPerOrder" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "DiscountCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountAction" (
    "id" TEXT NOT NULL,
    "discountAmount" INTEGER,
    "discountPercentage" INTEGER,
    "freeShipping" TEXT DEFAULT E'NO',
    "isSale" TEXT DEFAULT E'NO',

    CONSTRAINT "DiscountAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "canManageProducts" BOOLEAN NOT NULL DEFAULT false,
    "canSeeOtherUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,
    "canManageCart" BOOLEAN NOT NULL DEFAULT false,
    "canManageOrders" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingZone" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT E'',
    "countryCode" TEXT NOT NULL DEFAULT E'',
    "state" TEXT NOT NULL DEFAULT E'',
    "stateCode" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "ShippingZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "method" TEXT NOT NULL DEFAULT E'',
    "expectedDeliveryText" TEXT NOT NULL DEFAULT E'',
    "baseCost" INTEGER NOT NULL,
    "charge" INTEGER NOT NULL,
    "perEachKg" INTEGER NOT NULL,
    "overKg" INTEGER NOT NULL,

    CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "product" TEXT,
    "title" TEXT NOT NULL DEFAULT E'',
    "message" TEXT NOT NULL DEFAULT E'',
    "rating" TEXT,
    "customerName" TEXT NOT NULL DEFAULT E'',
    "customerEmail" TEXT,
    "isCelebrityReview" BOOLEAN NOT NULL DEFAULT false,
    "featureInHomePage" BOOLEAN NOT NULL DEFAULT false,
    "createdOn" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Category_childCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Category_products" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Product_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Product_additionalImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Review_images" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Product_colorPalette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Product_videoEmbedLinks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Review_videoEmbedLinks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Product_defaultVariantOptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Accessory_products" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiscountCondition_productsIsIn" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiscountAction_freebieProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductOption_optionValues" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductVariant_options" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Customer_skuSubscriptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ShippingMethod_zones" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tag_key" ON "Tag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Color_hexColor_key" ON "Color"("hexColor");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "ProductOption_product_idx" ON "ProductOption"("product");

-- CreateIndex
CREATE INDEX "ProductOption_optionName_idx" ON "ProductOption"("optionName");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_product_idx" ON "ProductVariant"("product");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_sku_key" ON "Stock"("sku");

-- CreateIndex
CREATE INDEX "Stock_product_idx" ON "Stock"("product");

-- CreateIndex
CREATE INDEX "Stock_vendor_idx" ON "Stock"("vendor");

-- CreateIndex
CREATE INDEX "InboundStock_sku_idx" ON "InboundStock"("sku");

-- CreateIndex
CREATE INDEX "OutboundStock_sku_idx" ON "OutboundStock"("sku");

-- CreateIndex
CREATE INDEX "OutboundStock_order_idx" ON "OutboundStock"("order");

-- CreateIndex
CREATE INDEX "CartItem_product_idx" ON "CartItem"("product");

-- CreateIndex
CREATE INDEX "Order_customer_idx" ON "Order"("customer");

-- CreateIndex
CREATE INDEX "OrderItem_order_idx" ON "OrderItem"("order");

-- CreateIndex
CREATE INDEX "OrderItem_sku_idx" ON "OrderItem"("sku");

-- CreateIndex
CREATE INDEX "OrderNote_order_idx" ON "OrderNote"("order");

-- CreateIndex
CREATE INDEX "Discount_discountCondition_idx" ON "Discount"("discountCondition");

-- CreateIndex
CREATE INDEX "Discount_discountAction_idx" ON "Discount"("discountAction");

-- CreateIndex
CREATE INDEX "Review_product_idx" ON "Review"("product");

-- CreateIndex
CREATE INDEX "Review_customerEmail_idx" ON "Review"("customerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "_Category_childCategories_AB_unique" ON "_Category_childCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_Category_childCategories_B_index" ON "_Category_childCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Category_products_AB_unique" ON "_Category_products"("A", "B");

-- CreateIndex
CREATE INDEX "_Category_products_B_index" ON "_Category_products"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Product_tags_AB_unique" ON "_Product_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Product_tags_B_index" ON "_Product_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Product_additionalImages_AB_unique" ON "_Product_additionalImages"("A", "B");

-- CreateIndex
CREATE INDEX "_Product_additionalImages_B_index" ON "_Product_additionalImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Review_images_AB_unique" ON "_Review_images"("A", "B");

-- CreateIndex
CREATE INDEX "_Review_images_B_index" ON "_Review_images"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Product_colorPalette_AB_unique" ON "_Product_colorPalette"("A", "B");

-- CreateIndex
CREATE INDEX "_Product_colorPalette_B_index" ON "_Product_colorPalette"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Product_videoEmbedLinks_AB_unique" ON "_Product_videoEmbedLinks"("A", "B");

-- CreateIndex
CREATE INDEX "_Product_videoEmbedLinks_B_index" ON "_Product_videoEmbedLinks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Review_videoEmbedLinks_AB_unique" ON "_Review_videoEmbedLinks"("A", "B");

-- CreateIndex
CREATE INDEX "_Review_videoEmbedLinks_B_index" ON "_Review_videoEmbedLinks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Product_defaultVariantOptions_AB_unique" ON "_Product_defaultVariantOptions"("A", "B");

-- CreateIndex
CREATE INDEX "_Product_defaultVariantOptions_B_index" ON "_Product_defaultVariantOptions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Accessory_products_AB_unique" ON "_Accessory_products"("A", "B");

-- CreateIndex
CREATE INDEX "_Accessory_products_B_index" ON "_Accessory_products"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountCondition_productsIsIn_AB_unique" ON "_DiscountCondition_productsIsIn"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountCondition_productsIsIn_B_index" ON "_DiscountCondition_productsIsIn"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountAction_freebieProducts_AB_unique" ON "_DiscountAction_freebieProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountAction_freebieProducts_B_index" ON "_DiscountAction_freebieProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductOption_optionValues_AB_unique" ON "_ProductOption_optionValues"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductOption_optionValues_B_index" ON "_ProductOption_optionValues"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductVariant_options_AB_unique" ON "_ProductVariant_options"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductVariant_options_B_index" ON "_ProductVariant_options"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Customer_skuSubscriptions_AB_unique" ON "_Customer_skuSubscriptions"("A", "B");

-- CreateIndex
CREATE INDEX "_Customer_skuSubscriptions_B_index" ON "_Customer_skuSubscriptions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShippingMethod_zones_AB_unique" ON "_ShippingMethod_zones"("A", "B");

-- CreateIndex
CREATE INDEX "_ShippingMethod_zones_B_index" ON "_ShippingMethod_zones"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_optionName_fkey" FOREIGN KEY ("optionName") REFERENCES "ProductOptionName"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_vendor_fkey" FOREIGN KEY ("vendor") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundStock" ADD CONSTRAINT "InboundStock_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundStock" ADD CONSTRAINT "OutboundStock_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundStock" ADD CONSTRAINT "OutboundStock_order_fkey" FOREIGN KEY ("order") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_fkey" FOREIGN KEY ("customer") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_fkey" FOREIGN KEY ("order") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_order_fkey" FOREIGN KEY ("order") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_discountCondition_fkey" FOREIGN KEY ("discountCondition") REFERENCES "DiscountCondition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_discountAction_fkey" FOREIGN KEY ("discountAction") REFERENCES "DiscountAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Category_childCategories" ADD FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Category_childCategories" ADD FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Category_products" ADD FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Category_products" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_tags" ADD FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_tags" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_additionalImages" ADD FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_additionalImages" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Review_images" ADD FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Review_images" ADD FOREIGN KEY ("B") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_colorPalette" ADD FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_colorPalette" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_videoEmbedLinks" ADD FOREIGN KEY ("A") REFERENCES "EmbedLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_videoEmbedLinks" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Review_videoEmbedLinks" ADD FOREIGN KEY ("A") REFERENCES "EmbedLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Review_videoEmbedLinks" ADD FOREIGN KEY ("B") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_defaultVariantOptions" ADD FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_defaultVariantOptions" ADD FOREIGN KEY ("B") REFERENCES "ProductOptionValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Accessory_products" ADD FOREIGN KEY ("A") REFERENCES "Accessory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Accessory_products" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountCondition_productsIsIn" ADD FOREIGN KEY ("A") REFERENCES "DiscountCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountCondition_productsIsIn" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountAction_freebieProducts" ADD FOREIGN KEY ("A") REFERENCES "DiscountAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountAction_freebieProducts" ADD FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductOption_optionValues" ADD FOREIGN KEY ("A") REFERENCES "ProductOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductOption_optionValues" ADD FOREIGN KEY ("B") REFERENCES "ProductOptionValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductVariant_options" ADD FOREIGN KEY ("A") REFERENCES "ProductOptionValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductVariant_options" ADD FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Customer_skuSubscriptions" ADD FOREIGN KEY ("A") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Customer_skuSubscriptions" ADD FOREIGN KEY ("B") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShippingMethod_zones" ADD FOREIGN KEY ("A") REFERENCES "ShippingMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShippingMethod_zones" ADD FOREIGN KEY ("B") REFERENCES "ShippingZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
