"use client";

import RegisterOrder from "@/app/dashboard/register-order";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { order } from "./order-table/columns";

interface EditOrderDialogProps {
  selectedOrderId: string;
}

export default function EditOrderDialog({
  selectedOrderId,
}: EditOrderDialogProps) {
  const session = useSession();
  const userId = session.data?.user.id;
  const [openDialog, setOpenDialog] = useState(false);

  if (!userId) {
    return null; // or handle the case where userId is not available
  }

  return (
    <>
      <Button onClick={() => setOpenDialog(true)}>
        <Pencil className="mr-2 h-4 w-4" />
      </Button>
      {openDialog && (
        <RegisterOrder
          userId={userId}
          mode="edit"
          existingOrder={{ id: selectedOrderId } as order} // Assuming you have the order data available
          isOpen={openDialog}
          onOrderUpdated={(order) => {
            console.log("Order updated:", order);
            setOpenDialog(false);
          }}
        />
      )}
    </>
  );
}
