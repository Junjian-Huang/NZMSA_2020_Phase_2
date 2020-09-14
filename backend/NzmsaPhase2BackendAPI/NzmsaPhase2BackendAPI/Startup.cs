using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using NzmsaPhase2BackendAPI.Models;
using NzmsaPhase2BackendAPI.PeriodicJobs;
using System;

namespace NzmsaPhase2BackendAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
           {
               options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1}" });
           });

            services.AddCors(options =>
           {
               options.AddPolicy(MyAllowSpecificOrigins, builder =>
              {
                  builder.WithOrigins("http://localhost:3000", "http://junjianhuangmsaphase2.azurewebsites.net/swagger")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
              });
           });

            services.AddDbContext<AppDatabase>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("sqlDatabase"));
            });

            services.AddHangfire(config => config.UseMemoryStorage());

            services.AddHangfireServer();
            services.AddScoped<IPeriodicCanvasJobs, PeriodicCanvasJobs>();

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IPeriodicCanvasJobs PeriodicCanvasJobs)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseSwagger();

            app.UseSwaggerUI(x =>
           {
               x.SwaggerEndpoint("/swagger/v1/swagger.json", "My first API");
               //x.RoutePrefix = string.Empty; // launch swagger from root
           });

            app.UseCors(MyAllowSpecificOrigins);

            app.UseHangfireDashboard();

            RecurringJob.AddOrUpdate("1",
                () => PeriodicCanvasJobs.CreateNewCanvas(), "0 0 * * *",
                TimeZoneInfo.FindSystemTimeZoneById("New Zealand Standard Time"));

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
