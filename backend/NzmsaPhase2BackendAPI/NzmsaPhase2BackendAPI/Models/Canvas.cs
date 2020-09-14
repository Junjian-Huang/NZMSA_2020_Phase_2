using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NzmsaPhase2BackendAPI.Models
{
    public class Canvas
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CanvasID { get; set; }

        public ICollection<ColorData> ColorData { get; set; }

    }
}
