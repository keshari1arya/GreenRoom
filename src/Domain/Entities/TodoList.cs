namespace GreenRoom.Domain.Entities;

public class TodoList : BaseAuditableEntityWithMultiTenancy
{
    public string? Title { get; set; }

    public Colour Colour { get; set; } = Colour.White;

    public IList<TodoItem> Items { get; private set; } = new List<TodoItem>();
}
