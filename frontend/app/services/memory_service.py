# stores conversation history per user
conversation_history={}

def save_message(user_id: str, role: str, content: str):
    """Save a message to conversation history"""
    if user_id not in conversation_history:
        conversation_history[user_id] = []
    conversation_history[user_id].append({"role": role, "content": content})
    
    # keep just the last 10 messages to avoid token limits
    if len(conversation_history[user_id]) > 10:
        conversation_history[user_id] = conversation_history[user_id][-10:]
        
def get_conversation_history(user_id: str):
    """Get conversation history for a user"""
    return conversation_history.get(user_id, [])

def clear_history(user_id):
    """Clear conversation history for a user"""
    if user_id in conversation_history:
        conversation_history[user_id]=[]
    