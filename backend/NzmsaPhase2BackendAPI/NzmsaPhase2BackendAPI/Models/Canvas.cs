using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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
