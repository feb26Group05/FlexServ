var builder = WebApplication.CreateBuilder(args);

// Configure port 8080
builder.WebHost.UseUrls("http://localhost:8080");

// Add YARP Reverse Proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("GatewayCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("GatewayCors");

app.MapReverseProxy();

app.Run();
