using System.Collections.Generic;
using System.Threading.Tasks;
using DragAndDropSignalR.Models;
using Microsoft.AspNetCore.SignalR;

namespace DragAndDropSignalR.Hubs
{
    public class DragAndDropHub : Hub
    {
        private readonly List<Quote> _quotes;

        public DragAndDropHub(List<Quote> quotes)
        {
            _quotes = quotes;
        }

        public async Task SendPositionMoved(OnDragEndResult result)
        {
            await Clients.Others.SendAsync("ReceivePositionMoved", result);
        }

        public async Task SendQuoteAdded(Quote quote)
        {
            _quotes.Add(quote);

            await Clients.Others.SendAsync("ReceiveQuoteAdded", quote);
        }

        public async Task SendQuoteDeleted(string id)
        {
            var quote = _quotes.Find(x => x.Id == id);
            _quotes.Remove(quote);

            await Clients.Others.SendAsync("ReceiveQuoteDeleted", id);
        }
    }
}
