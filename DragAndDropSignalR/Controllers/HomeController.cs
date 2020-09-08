using DragAndDropSignalR.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace DragAndDropSignalR.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        public HomeController()
        {
        }

        [HttpGet]
        public IEnumerable<Quote> Get()
        {
            return Enumerable.Range(1, 10).Select(index => new Quote
            {
                Id = index.ToString(),
                Content = index.ToString()
            })
            .ToArray();
        }
    }
}
