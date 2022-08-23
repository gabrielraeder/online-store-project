// fetch das categorias
export async function getCategories() {
  const url = 'https://api.mercadolibre.com/sites/MLB/categories';
  const APIResponse = await fetch(url)
    .then((response) => response.json());
  return APIResponse;
}

// fetch dos produtos por categoria ou nome
export async function getProductsFromCategoryAndQuery(categoryId, query) {
  if (!categoryId) {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
    const queryResponse = await fetch(url).then((response) => response.json());
    return queryResponse;
  }
  const url = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}`;
  const idResponse = await fetch(url).then((response) => response.json());
  return idResponse;
}

// fetch de um produto específico por id
export async function getProductFromId(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  const itemResponse = await fetch(url).then((response) => response.json());
  return itemResponse;
}
