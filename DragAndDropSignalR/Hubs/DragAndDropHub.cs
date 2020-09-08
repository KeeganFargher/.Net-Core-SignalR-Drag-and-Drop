using DragAndDropSignalR.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragAndDropSignalR.Hubs
{
    public class DragAndDropHub : Hub
    {
        private readonly List<Quote> _quotes;
        private readonly UserCount _userCount;

        public DragAndDropHub(List<Quote> quotes, UserCount userCount)
        {
            _quotes = quotes;
            _userCount = userCount;
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

        public override Task OnConnectedAsync()
        {
            _userCount.Count++;
            Clients.All.SendAsync("ReceiveTotalUserCount", _userCount.Count);

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            _userCount.Count--;
            Clients.All.SendAsync("ReceiveTotalUserCount", _userCount.Count);

            return base.OnDisconnectedAsync(exception);
        }
    }
}
