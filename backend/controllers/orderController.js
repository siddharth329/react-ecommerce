import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

/**
 * @description     Create new Order
 * @route           POST /api/orders
 * @access          Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No order items');
		return;
	} else {
		const order = new Order({
			user: req.user._id,
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice
		});

		const createOrder = await order.save();

		res.status(201).json(createOrder);
	}
});

/**
 * @description     Get order by id
 * @route           GET /api/orders/:id
 * @access          Private
 */
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate('user', 'name email');

	if (order) {
		res.status(201).json(order);
	} else {
		res.status(404);
		throw new Error('Error not found');
	}
});

/**
 * @description     Update order to paid
 * @route           GET /api/orders/:id/pay
 * @access          Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address
		};

		const updatedOrder = await order.save();

		res.status(200).json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Error not found');
	}
});

/**
 * @description     Get logged in user orders
 * @route           GET /api/orders/myorders
 * @access          Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.status(200).json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders };
