@WebMvcTest(AuthController.class)
class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("Mock: Login thành công qua Controller")
    void testLoginWithMockedService() throws Exception {

        LoginResponse mockResponse = new LoginResponse(
                true, "Success", "mock-token"
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test\",\"password\":\"Pass123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(authService, times(1)).authenticate(any());
    }
}
