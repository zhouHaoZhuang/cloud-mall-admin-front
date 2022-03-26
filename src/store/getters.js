const getters = {
  token: (state) => state.user.token,
  productCode: (state) => {
    return state.user.productList.find(
      (ele) => ele.supplierProductCode === "CDN_ALI"
    ).productCode;
  }
};

export default getters;
