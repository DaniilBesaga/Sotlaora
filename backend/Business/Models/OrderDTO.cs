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
        public string? DesiredTimeStart { get; set; }
        public string? DesiredTimeEnd { get; set; }

        public List<int> Subcategories { get; set; } = new List<int>();

        public List<int> ImageFileIds { get; set; } = new List<int>();
        public int ClientId { get; set; }
    }
}