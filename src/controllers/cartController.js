import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";
const cartController = {
  addToCart: async (req, res) => {
  const userId = req.user;
  const { productId } = req.body;
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = product.price;
    const offerPrice = product.offerPrice ?? null;

    let cart = await Cart.findOne({ userId });

    const newItem = {
      productId,
      quantity,
      price,
      offerPrice,
    };

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push(newItem);
      }
    } else {
      cart = new Cart({
        userId,
        items: [newItem],
      });
    }

    // Optional: Auto calculate total
    cart.totalAmount = cart.items.reduce((acc, item) => {
      const itemPrice = item.offerPrice ?? item.price;
      return acc + itemPrice * item.quantity;
    }, 0);

    await cart.save();
    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
},
    
};

export default cartController;
