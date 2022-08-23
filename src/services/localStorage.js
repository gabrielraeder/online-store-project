const CART_ITEMS = 'cart-items';

// se não houver nada salvo,
// é colocado um array vazio para não dar erro
if (!JSON.parse(localStorage.getItem(CART_ITEMS))) {
  localStorage.setItem(CART_ITEMS, JSON.stringify([]));
}

// faz o parse dos itens recuperados
const readSavedCart = () => JSON.parse(localStorage.getItem(CART_ITEMS));

// salva itens no localStorage
const saveCartProducts = (cartItems) => localStorage
  .setItem(CART_ITEMS, JSON.stringify(cartItems));

// recebe produto e atualiza o localStorage
export const addToCart = (product) => {
  const savedCart = readSavedCart();
  saveCartProducts([...savedCart, product]);
};

// recupera produtos do localStorage
export const getSavedCartProducts = () => {
  const savedCart = readSavedCart();
  return savedCart;
};

// remove um item específico recebido do localStorage
export const removeFromCart = (product) => {
  const savedCart = readSavedCart();
  const filterIdenticalProducts = savedCart.filter((item) => item.id === product.id);
  const filterOtherProducts = savedCart.filter((item) => item.id !== product.id);
  filterIdenticalProducts.pop();
  saveCartProducts([...filterIdenticalProducts, ...filterOtherProducts]);
};

// remove todos os itens iguais do localStorage
export const removeAllProduct = (product) => {
  const savedCart = readSavedCart();
  saveCartProducts(savedCart.filter((item) => item.id !== product.id));
};
