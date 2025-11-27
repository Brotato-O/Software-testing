class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetProductById() {
        Product mockProduct = new Product(
                1L, "Laptop", 15000000, 10, "Electronics"
        );

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(mockProduct));

        ProductDto result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());

        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateProduct() {
        Product newProd = new Product(null, "Laptop", 15000000, 10, "Electronics");
        Product savedProd = new Product(1L, "Laptop", 15000000, 10, "Electronics");

        when(productRepository.save(any(Product.class)))
                .thenReturn(savedProd);

        ProductDto dto = new ProductDto("Laptop", 15000000, 10, "Electronics");

        ProductDto result = productService.createProduct(dto);

        assertEquals(1L, result.getId());
        verify(productRepository).save(any(Product.class));
    }
}
