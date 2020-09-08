using DragAndDropSignalR.Hubs;

namespace DragAndDropSignalR.Models
{
    public class OnDragEndResult
    {
        public Destination Destination { get; set; }
        public Source Source { get; set; }
    }
}