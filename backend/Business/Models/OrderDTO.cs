using System;
using System.Collections.Generic;
using Sotlaora.Business.Entities;

namespace Backend.Business.Models
{
    public class OrderDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PostedAt { get; set; }
        public decimal Price { get; set; }
        public Location Location { get; set; }
        public string AdditionalComment { get; set; } = string.Empty;

        public DateTime? DeadlineDate { get; set; }
        public TimeOnly? DesiredTimeStart { get; set; }
        public TimeOnly? DesiredTimeEnd { get; set; }

        public List<int> Subcategories { get; set; } = new List<int>();

        public List<string> ImageFileRefs { get; set; } = new List<string>();
        public List<int> ImageFileIds { get; set; } = new List<int>();
        
        public OrderStatus Status { get; set; }
        public int ClientId { get; set; }
        public int? ProId { get; set; }
    }
}