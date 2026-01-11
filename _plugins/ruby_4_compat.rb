# Monkey patch for Ruby 4.0 compatibility
# The tainted? and untaint methods were removed in Ruby 3.2
# This patch adds them back as no-ops to maintain compatibility with older gems

unless "".respond_to?(:tainted?)
  class String
    def tainted?
      false
    end

    def untaint
      self
    end
  end

  class Object
    def tainted?
      false
    end

    def untaint
      self
    end
  end
end
