<?php

namespace App\Repositories;

use App\Models\Supplier;

class SupplierRepository
{
    public function createSupplier(array $data)
    {
        return Supplier::create($data);
    }

    public function updateSupplier(array $data, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->update($data);

        return $supplier;
    }

    public function deleteSupplier($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return $supplier;
    }

    public function changeStatus($id, $status)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->status = $status;
        $supplier->save();

        return $supplier;
    }
}
