"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function OrgaSwitcher() {
  return (
    <OrganizationSwitcher
      hidePersonal
      afterCreateOrganizationUrl={"/organization/:slug"}
      afterSelectOrganizationUrl={"/organization/:slug"}
      createOrganizationMode="modal"
      appearance={{
        baseTheme: dark,
      }}
    />
  );
}
