using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FileUpload.API.Models
{  
    public class ItemImage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ItemImageId { get; set; }
        public int ItemId { get; set; }
        public string Name { get; set; }
        public bool IsPrimary { get; set; }
    }
}
