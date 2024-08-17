import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1722904502694 implements MigrationInterface {
  name = 'Migration1722904502694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_type_name_enum" AS ENUM('admin', 'barber', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" "public"."user_type_name_enum" DEFAULT 'user', CONSTRAINT "PK_1f9c6d05869e094dee8fa7d392a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."services_type_enum" AS ENUM('hair', 'beard', 'eyebrow', 'skincare', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying, "type" "public"."services_type_enum" NOT NULL DEFAULT 'hair', "value" character varying, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "barber" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying, "document" character varying(11), "email" character varying, "cellphone" character varying, CONSTRAINT "PK_393a066f1a87c8642e776ba7054" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scheduling" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "date" TIMESTAMP, "userId" uuid, "barbershopId" uuid, "barberId" uuid, CONSTRAINT "PK_a19510fdc2c3f1c9daff8b6e395" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "barber_shop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying, "document" character varying, "address" character varying, "lat" character varying, "long" character varying, "cellphone" character varying, "email" character varying, CONSTRAINT "PK_1f886aa2348269079caccdd1ad4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying, "email" character varying, "password" character varying, "birthdate" TIMESTAMP, "cellphone" character varying(20), "userTypeId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "barbershop_services" ("servicesId" uuid NOT NULL, "barberShopId" uuid NOT NULL, CONSTRAINT "PK_72f15f9e1154dbd2bc8cf65a7d3" PRIMARY KEY ("servicesId", "barberShopId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3e919000f077ec7fa9632434b" ON "barbershop_services" ("servicesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_04152bc970f4aef69d46504ae6" ON "barbershop_services" ("barberShopId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "scheduling_services" ("schedulingId" uuid NOT NULL, "servicesId" uuid NOT NULL, CONSTRAINT "PK_79736fe43adf31041f1e5046ca0" PRIMARY KEY ("schedulingId", "servicesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f87620f6e30d98e802f67b49d" ON "scheduling_services" ("schedulingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_94f8861b25d0abd3810ab6c27e" ON "scheduling_services" ("servicesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "barbershop_barbers" ("barberShopId" uuid NOT NULL, "barberId" uuid NOT NULL, CONSTRAINT "PK_ad2d74688b7bfda7e1eea38403e" PRIMARY KEY ("barberShopId", "barberId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55abf62f0d6fb800d53f65cc44" ON "barbershop_barbers" ("barberShopId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_197b686c8784ad37778e778844" ON "barbershop_barbers" ("barberId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling" ADD CONSTRAINT "FK_b5df7f21de3b47bd5d29c3deb94" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling" ADD CONSTRAINT "FK_99545198559ecb479007fe01090" FOREIGN KEY ("barbershopId") REFERENCES "barber_shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling" ADD CONSTRAINT "FK_843feaec9e559db38215f0212c9" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_29f29dffce2845a1abc901d4e85" FOREIGN KEY ("userTypeId") REFERENCES "user_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "barbershop_services" ADD CONSTRAINT "FK_f3e919000f077ec7fa9632434b6" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "barbershop_services" ADD CONSTRAINT "FK_04152bc970f4aef69d46504ae68" FOREIGN KEY ("barberShopId") REFERENCES "barber_shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling_services" ADD CONSTRAINT "FK_6f87620f6e30d98e802f67b49d5" FOREIGN KEY ("schedulingId") REFERENCES "scheduling"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling_services" ADD CONSTRAINT "FK_94f8861b25d0abd3810ab6c27e3" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "barbershop_barbers" ADD CONSTRAINT "FK_55abf62f0d6fb800d53f65cc449" FOREIGN KEY ("barberShopId") REFERENCES "barber_shop"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "barbershop_barbers" ADD CONSTRAINT "FK_197b686c8784ad37778e7788440" FOREIGN KEY ("barberId") REFERENCES "barber"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "barbershop_barbers" DROP CONSTRAINT "FK_197b686c8784ad37778e7788440"`,
    );
    await queryRunner.query(
      `ALTER TABLE "barbershop_barbers" DROP CONSTRAINT "FK_55abf62f0d6fb800d53f65cc449"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling_services" DROP CONSTRAINT "FK_94f8861b25d0abd3810ab6c27e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling_services" DROP CONSTRAINT "FK_6f87620f6e30d98e802f67b49d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "barbershop_services" DROP CONSTRAINT "FK_04152bc970f4aef69d46504ae68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "barbershop_services" DROP CONSTRAINT "FK_f3e919000f077ec7fa9632434b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_29f29dffce2845a1abc901d4e85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling" DROP CONSTRAINT "FK_843feaec9e559db38215f0212c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling" DROP CONSTRAINT "FK_99545198559ecb479007fe01090"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling" DROP CONSTRAINT "FK_b5df7f21de3b47bd5d29c3deb94"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_197b686c8784ad37778e778844"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55abf62f0d6fb800d53f65cc44"`,
    );
    await queryRunner.query(`DROP TABLE "barbershop_barbers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_94f8861b25d0abd3810ab6c27e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f87620f6e30d98e802f67b49d"`,
    );
    await queryRunner.query(`DROP TABLE "scheduling_services"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_04152bc970f4aef69d46504ae6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3e919000f077ec7fa9632434b"`,
    );
    await queryRunner.query(`DROP TABLE "barbershop_services"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "barber_shop"`);
    await queryRunner.query(`DROP TABLE "scheduling"`);
    await queryRunner.query(`DROP TABLE "barber"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TYPE "public"."services_type_enum"`);
    await queryRunner.query(`DROP TABLE "user_type"`);
    await queryRunner.query(`DROP TYPE "public"."user_type_name_enum"`);
  }
}
