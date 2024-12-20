﻿using System.Net;
using System.Net.Mail;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using GreenRoom.Application.Common.Configurations;
using GreenRoom.Application.Common.Interfaces;
using GreenRoom.Application.Common.Models;
using GreenRoom.Application.Interfaces;
using GreenRoom.Domain.Constants;
using GreenRoom.Infrastructure.Data;
using GreenRoom.Infrastructure.Data.Interceptors;
using GreenRoom.Infrastructure.Identity;
using GreenRoom.Infrastructure.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        Guard.Against.Null(connectionString, message: "Connection string 'DefaultConnection' not found.");

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityWithMultiTenancyInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        services.AddAwsS3Storage(configuration);
        services.AddPaymentGateway(configuration);

        services.AddScoped<IStorageManagementService, AwsS3Service>();


        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());

            options.UseSqlServer(connectionString);
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<ApplicationDbContextInitialiser>();

        services.AddAuthentication()
            .AddBearerToken(IdentityConstants.BearerScheme);

        services.AddAuthorizationBuilder();

        services
            .AddIdentityCore<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();

        services.AddSingleton(TimeProvider.System);
        services.AddTransient<IIdentityService, AppIdentityService>();
        services.AddScoped<IMultiTenancyService, MultiTenancyService>();

        services.AddScoped<INotificationService, NotificationService>();

        services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));
        services.Configure<UiSettings>(configuration.GetSection("UiSettings"));

        services.AddSingleton<SmtpClient>(provider =>
         {
             var smtpSettings = configuration.GetSection("SmtpSettings").Get<SmtpSettings>();
             Guard.Against.Null(smtpSettings, "SmtpSettings not found in configuration");

             var smtpClient = new SmtpClient(smtpSettings.Host)
             {
                 Port = smtpSettings.Port,
                 Credentials = new NetworkCredential(smtpSettings.Username, smtpSettings.Password),
                 EnableSsl = smtpSettings.EnableSsl
             };
             return smtpClient;
         });



        services.AddAuthorization(options =>
            options.AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator)));

        return services;
    }

    private static void AddAwsS3Storage(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AwsS3Settings>(configuration.GetSection("AwsS3Settings"));
        services.AddScoped<IAmazonS3>(provider =>
        {
            var awsS3Settings = configuration.GetSection("AwsS3Settings").Get<AwsS3Settings>();
            Guard.Against.Null(awsS3Settings, "AwsS3Settings not found in configuration");

            var credentials = new BasicAWSCredentials(awsS3Settings.AccessKey, awsS3Settings.Secret);
            var config = new AmazonS3Config
            {
                // ServiceURL = awsS3Settings.InstanceUrl,
                UseHttp = true,
                RegionEndpoint = RegionEndpoint.GetBySystemName(awsS3Settings.Region)
            };
            return new AmazonS3Client(credentials, config);
        });
    }

    private static void AddPaymentGateway(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<StripeSettings>(configuration.GetSection("StripeSettings"));
        services.AddScoped<StripeClient>(provider =>
        {
            var stripeSettings = configuration.GetSection("StripeSettings").Get<StripeSettings>();
            Guard.Against.Null(stripeSettings, "StripeSettings not found in configuration");

            return new StripeClient(stripeSettings.SecretKey);
        });

        services.AddScoped<IPaymentGatewayService, StripeService>();
    }
}
