using AuthService.Dtos;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/providers")]
    public class ServiceProviderController : ControllerBase
    {
        private readonly IServiceProviderService _providerService;

        public ServiceProviderController(IServiceProviderService providerService)
        {
            _providerService = providerService;
        }

        [HttpGet]
        public IActionResult GetAllProviders([FromQuery] long? categoryId, [FromQuery] string? keyword)
        {
            var providers = _providerService.GetAllProviders(categoryId, keyword);
            return Ok(providers);
        }

        [HttpPost]
        public IActionResult CreateProvider([FromBody] ServiceProviderRequestDto requestDto)
        {
            var created = _providerService.CreateProvider(requestDto);
            return CreatedAtAction(nameof(GetProviderById), new { id = created.Id }, created);
        }

        [HttpGet("{id:long}")]
        public IActionResult GetProviderById(long id)
        {
            try
            {
                var provider = _providerService.GetProviderById(id);
                return Ok(provider);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPut("{id:long}")]
        public IActionResult UpdateProvider(long id, [FromBody] UpdateServiceProviderRequestDto requestDto)
        {
            try
            {
                var updated = _providerService.UpdateProvider(id, requestDto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("user/{userId:long}")]
        public IActionResult GetProviderByUserId(long userId)
        {
            try
            {
                var provider = _providerService.GetProviderByUserId(userId);
                return Ok(provider);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("available")]
        public IActionResult GetAvailableProviders()
        {
            var providers = _providerService.GetAllAvailableProviders();
            return Ok(providers);
        }

        [HttpPost("{id:long}/services")]
        public IActionResult AddServices(long id, [FromBody] HashSet<long> serviceIds)
        {
            try
            {
                var updated = _providerService.AddServicesToProvider(id, serviceIds);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
