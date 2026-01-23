package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.CartResponseDto;
import com.justlamvt05.bookshop.domain.entity.Cart;
import com.justlamvt05.bookshop.domain.entity.CartItem;
import com.justlamvt05.bookshop.domain.entity.Product;
import com.justlamvt05.bookshop.domain.entity.User;
import com.justlamvt05.bookshop.domain.repository.CartItemRepository;
import com.justlamvt05.bookshop.domain.repository.CartRepository;
import com.justlamvt05.bookshop.domain.repository.ProductRepository;
import com.justlamvt05.bookshop.domain.repository.UserRepository;
import com.justlamvt05.bookshop.mapper.CartMapper;
import com.justlamvt05.bookshop.payload.response.ApiCode;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;

    @Override
    public ApiResponse<?> getMyCart(String userId) {

        Cart cart = cartRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        CartResponseDto response = cartMapper.toCartResponse(cart);

        return ApiResponse.success(response);
    }

    @Override
    public ApiResponse<?> addToCart(String userId, String productId, Integer quantity) {

        if (quantity <= 0) {
            return ApiResponse.error(ApiCode.BAD_REQUEST,"Quantity must be greater than 0");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .cartId(UUID.randomUUID().toString())
                                .user(user)
                                .build()
                ));

        Optional<CartItem> optionalItem =
                cartItemRepository.findByCartAndProduct(cart.getCartId(), productId);

        if (optionalItem.isPresent()) {
            CartItem item = optionalItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CartItem newItem = CartItem.builder()
                    .cartItemId(UUID.randomUUID().toString())
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();

            cartItemRepository.save(newItem);
        }

        return ApiResponse.success("Add to cart successfully");
    }

    @Override
    public ApiResponse<?> updateCartItem(String userId, String productId, Integer quantity) {

        Cart cart = cartRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository
                .findByCartAndProduct(cart.getCartId(), productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return ApiResponse.success("Cart item removed");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return ApiResponse.success("Cart item updated");
    }

    @Override
    public ApiResponse<?> removeCartItem(String userId, String productId) {

        Cart cart = cartRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository
                .findByCartAndProduct(cart.getCartId(), productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItemRepository.delete(item);

        return ApiResponse.success("Remove cart item successfully");
    }

    @Override
    public ApiResponse<?> clearCart(String userId) {

        Cart cart = cartRepository.findByUser(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);

        return ApiResponse.success("Clear cart successfully");
    }
}
