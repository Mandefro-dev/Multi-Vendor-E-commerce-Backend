async create(req: AuthRequest, res: Response) {
  const order = await orderService.createOrder(
    req.user.id,
    req.body
  );

  res.status(201).json(order);
}