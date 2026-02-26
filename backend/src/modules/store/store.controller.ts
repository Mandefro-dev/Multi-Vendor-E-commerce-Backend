import { Response } from "express";
import { AuthRequest } from "../../middlewares/requireAuth";
import * as storeService from "./store.service";
import { error } from "console";
export async function create(req: AuthRequest, res: Response) {
  const { name, id } = req.body;
  try {
    if (!name || !id) {
      return res.status(400).json({ message: "name and id are required" });
    }
    const existsingStore = await storeService.getStoreById(id);
    if (existsingStore) {
      return res.status(400).json({
        message: "Store already exists",
      });
    }

    const store = await storeService.createStore(req.body.name, req.user.id);

    res.status(201).json({
      message: "store created successfully",
      store,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "an error occurred while creating store", error });
  }
}

export async function myStores(req: AuthRequest, res: Response) {
  const id = req.user.id;

  try {
    if (!id) {
      return res.status(id).json("user is not authenticated.");
    }

    const stores = await storeService.getVendorStores(id);
    res.status(201).json(stores);
  } catch (error) {
    res.status(500).json({
      message: "an error occurred while fetching stores",
      error,
    });
  }
}

export async function getAll(req: AuthRequest, res: Response) {
  try {
    const stores = await storeService.getAllStores();
    res.status(200).json(stores);
  } catch (error) {}
  res.status(500).json({
    message: "an error occured while fetching stores",
    error,
  });
}

export async function update(req: AuthRequest, res: Response) {
  const id = req.params.id;
  const name = req.body.name;
  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const store = await storeService.updateStore(id as string, name);
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({
      message: "an error occurred while updating store",
      error,
    });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  const id = req.params.id;
  try {
    await storeService.deleteStore(id as string);
    res.status(200).json({
      message: "Store deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occurred while deleting store",
    });
  }
}

// export async function g
